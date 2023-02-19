use std::collections::HashMap;

use nalgebra::Point3;
use rapier3d::prelude::*;
use serde::{Deserialize, Serialize};

use crate::{console_log, Letter};
mod hulls;

#[derive(Serialize, Deserialize)]
pub struct PhysicsState {
    pub islands: IslandManager,
    pub broad_phase: BroadPhase,
    pub narrow_phase: NarrowPhase,
    pub bodies: RigidBodySet,
    pub colliders: ColliderSet,
    pub joints: ImpulseJointSet,
    pub ccd_solver: CCDSolver,
    pub query_pipeline: Option<QueryPipeline>,
    pub integration_parameters: IntegrationParameters,
    pub gravity: Vector<f32>,
}

impl PhysicsState {
    pub fn new() -> PhysicsState {
        let gravity = vector![0.0, -9.81, 0.0];
        let integration_parameters = IntegrationParameters::default();
        let islands = IslandManager::new();
        let broad_phase = BroadPhase::new();
        let narrow_phase = NarrowPhase::new();
        let mut joints = ImpulseJointSet::new();
        let ccd_solver = CCDSolver::new();
        let mut bodies = RigidBodySet::new();
        let mut colliders = ColliderSet::new();

        // Bodies
        let a_body = RigidBodyBuilder::dynamic()
            .translation(vector![hulls::A_POS.x, hulls::A_POS.y, 0.0])
            .user_data(handle_ids::A)
            .build();
        let a_body_handle = bodies.insert(a_body);
        let l_body = RigidBodyBuilder::dynamic()
            .translation(vector![hulls::L_POS.x, hulls::L_POS.y, 0.0])
            .user_data(handle_ids::L)
            .build();
        let l_body_handle = bodies.insert(l_body);
        let i_body = RigidBodyBuilder::dynamic()
            .translation(vector![hulls::I_POS.x, hulls::I_POS.y, 0.0])
            .user_data(handle_ids::I)
            .build();
        let i_body_handle = bodies.insert(i_body);
        let v_body = RigidBodyBuilder::dynamic()
            .translation(vector![hulls::V_POS.x, hulls::V_POS.y, 0.0])
            .user_data(handle_ids::V)
            .build();
        let v_body_handle = bodies.insert(v_body);
        let e_body = RigidBodyBuilder::dynamic()
            .translation(vector![hulls::E_POS.x, hulls::E_POS.y, 0.0])
            .user_data(handle_ids::E)
            .build();
        let e_body_handle = bodies.insert(e_body);

        // Joints
        let a_joint_anchor = RigidBodyBuilder::fixed()
            .translation(vector![hulls::A_POS.x, hulls::A_POS.y, 0.0])
            .build();
        let a_joint_handle = bodies.insert(a_joint_anchor);
        joints.insert(a_body_handle, a_joint_handle, get_joint(), false);

        let l_joint_anchor = RigidBodyBuilder::fixed()
            .translation(vector![hulls::L_POS.x, hulls::L_POS.y, 0.0])
            .build();
        let l_joint_handle = bodies.insert(l_joint_anchor);
        joints.insert(l_body_handle, l_joint_handle, get_joint(), false);

        let i_joint_anchor = RigidBodyBuilder::fixed()
            .translation(vector![hulls::I_POS.x, hulls::I_POS.y, 0.0])
            .build();
        let i_joint_handle = bodies.insert(i_joint_anchor);
        joints.insert(i_body_handle, i_joint_handle, get_joint(), false);

        let v_joint_anchor = RigidBodyBuilder::fixed()
            .translation(vector![hulls::V_POS.x, hulls::V_POS.y, 0.0])
            .build();
        let v_joint_handle = bodies.insert(v_joint_anchor);
        joints.insert(v_body_handle, v_joint_handle, get_joint(), false);

        let e_joint_anchor = RigidBodyBuilder::fixed()
            .translation(vector![hulls::E_POS.x, hulls::E_POS.y, 0.0])
            .build();
        let e_joint_handle = bodies.insert(e_joint_anchor);
        joints.insert(e_body_handle, e_joint_handle, get_joint(), false);

        // A Hulls
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::A_HULL_0).expect("Invalid hull"),
            a_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::A_HULL_1).expect("Invalid hull"),
            a_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::A_HULL_2).expect("Invalid hull"),
            a_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::A_HULL_3).expect("Invalid hull"),
            a_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::A_HULL_4).expect("Invalid hull"),
            a_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::A_HULL_5).expect("Invalid hull"),
            a_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::A_HULL_6).expect("Invalid hull"),
            a_body_handle,
            &mut bodies,
        );

        // L Hulls
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::L_HULL_0).expect("Invalid hull"),
            l_body_handle,
            &mut bodies,
        );

        // I Hulls
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::I_HULL_0).expect("Invalid hull"),
            i_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::I_HULL_1).expect("Invalid hull"),
            i_body_handle,
            &mut bodies,
        );

        // V Hulls
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::V_HULL_0).expect("Invalid hull"),
            v_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::V_HULL_1).expect("Invalid hull"),
            v_body_handle,
            &mut bodies,
        );

        // E Hulls
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::E_HULL_0).expect("Invalid hull"),
            e_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::E_HULL_1).expect("Invalid hull"),
            e_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::E_HULL_2).expect("Invalid hull"),
            e_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::E_HULL_3).expect("Invalid hull"),
            e_body_handle,
            &mut bodies,
        );
        colliders.insert_with_parent(
            ColliderBuilder::convex_hull(&hulls::E_HULL_4).expect("Invalid hull"),
            e_body_handle,
            &mut bodies,
        );

        PhysicsState {
            gravity,
            integration_parameters,
            islands,
            broad_phase,
            narrow_phase,
            joints,
            colliders,
            ccd_solver,
            bodies,
            query_pipeline: None,
        }
    }
}

pub struct Impulse {
    pub letter: Letter,
    pub point: Point3<f32>,
}

struct Handles {
    pub a: Option<RigidBodyHandle>,
    pub l: Option<RigidBodyHandle>,
    pub i: Option<RigidBodyHandle>,
    pub v: Option<RigidBodyHandle>,
    pub e: Option<RigidBodyHandle>,
}

mod handle_ids {
    pub const A: u128 = 100;
    pub const L: u128 = 101;
    pub const I: u128 = 102;
    pub const V: u128 = 103;
    pub const E: u128 = 104;
}

impl Handles {
    pub fn from_state(state: &PhysicsState) -> Handles {
        let mut handles = Handles {
            a: None,
            l: None,
            i: None,
            v: None,
            e: None,
        };
        for (handle, body) in state.bodies.iter() {
            match body.user_data {
                handle_ids::A => handles.a = Some(handle),
                handle_ids::L => handles.l = Some(handle),
                handle_ids::I => handles.i = Some(handle),
                handle_ids::V => handles.v = Some(handle),
                handle_ids::E => handles.e = Some(handle),
                _ => (),
            };
        }
        handles
    }
    pub fn handle(&self, letter: &Letter) -> RigidBodyHandle {
        match letter {
            Letter::A => self.a.expect("State missing A body"),
            Letter::L => self.l.expect("State missing L body"),
            Letter::I => self.i.expect("State missing I body"),
            Letter::V => self.v.expect("State missing V body"),
            Letter::E => self.e.expect("State missing E body"),
        }
    }
}

pub fn get_position(state: &PhysicsState, letter: Letter) -> (Vector<f32>, Rotation<f32>) {
    let handles = Handles::from_state(&state);
    let body = state
        .bodies
        .get(handles.handle(&letter))
        .expect("Missing body for position");
    return (body.translation().to_owned(), body.rotation().to_owned());
}

pub fn advance_physics(
    state: &mut PhysicsState,
    current_step: usize,
    num_steps: usize,
    impulses: HashMap<usize, Vec<Impulse>>,
) {
    let mut physics_pipeline = PhysicsPipeline::new();
    let mut multibody_joint_set = MultibodyJointSet::new();
    let physics_hooks = ();
    let event_handler = ();
    let handles = Handles::from_state(&state);

    for step in current_step..current_step + num_steps {
        if impulses.contains_key(&step) {
            for impulse in &impulses[&step][..] {
                let handle = handles.handle(&impulse.letter);
                let body = state
                    .bodies
                    .get_mut(handle)
                    .expect("Missing body for physics");
                body.apply_impulse_at_point(vector![0.0, 0.0, 50.0], impulse.point, true);
            }
        }

        physics_pipeline.step(
            &state.gravity,
            &state.integration_parameters,
            &mut state.islands,
            &mut state.broad_phase,
            &mut state.narrow_phase,
            &mut state.bodies,
            &mut state.colliders,
            &mut state.joints,
            &mut multibody_joint_set,
            &mut state.ccd_solver,
            // TODO: do we ever need to init from state.query_pipeline?
            None,
            &physics_hooks,
            &event_handler,
        );
    }
}

fn get_joint() -> RevoluteJointBuilder {
    let x_axis = Vector::x_axis();
    RevoluteJointBuilder::new(x_axis)
        .local_anchor1(point![0.0, 0.0, 0.0])
        .local_anchor2(point![0.0, 0.0, 0.0])
        .motor_position(0.0, 80.0, 8.0)
}
